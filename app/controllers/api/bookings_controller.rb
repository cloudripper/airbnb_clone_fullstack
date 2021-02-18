module Api


    class BookingsController < ApplicationController
      def create
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { error: 'user not logged in' }, status: :unauthorized if !session
  
        property = Property.find_by(id: params[:booking][:property_id])
        return render json: { error: 'cannot find property' }, status: :not_found if !property
  
        begin
          @booking = Booking.create({ user_id: session.user.id, property_id: property.id, start_date: params[:booking][:start_date], end_date: params[:booking][:end_date], status: 'Incomplete'})
          render 'api/bookings/create', status: :created
        rescue ArgumentError => e
          render json: { error: e.message }, status: :bad_request
        end
      end

      def update
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { success: false } unless session

        user = session.user
        @booking = user.bookings.find_by(id: params[:id])
        return render json: { error: 'cannot find booking' }, status: :not_found if not @booking
        return render 'bad_request', status: :bad_request if not @booking.update(booking_params)
        render 'api/bookings/show'
      end

      def destroy 
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { success: false } unless session
        
        user = session.user
        booking = Booking.find_by(id: params[:id])

        if booking and booking.user == user and booking.destroy
          render json: {
            success: true,
            status: :ok,
          }
        else 
          render json: {
            success: false 
          }
        end
      end
  
      def get_property_bookings
        property = Property.find_by(id: params[:id])
        return render json: { error: 'cannot find property' }, status: :not_found if !property
  
        @bookings = property.bookings.where("end_date > ? ", Date.today)
        render 'api/bookings/index'
      end

      def get_user_bookings
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { success: false } unless session
        
        user = session.user
        user_param = User.find_by(id: params[:user_id])
############
        if user_param.id == user.id
          @bookings = user.bookings.all.sort
          
          render 'api/bookings/index'
        else 
          render json: {
            success: false 
          }
        end
#################      
      end 

      def get_booking
        require 'date'

        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { success: false } unless session

        user = session.user
        user_param = User.find_by(id: params[:user_id])
        
        if user_param.id == user.id
          @booking = user.bookings.find_by(id: params[:id])
          return render json: { error: 'cannot find booking' }, status: :not_found if not @booking
          
          @created_at = date_parse(@booking.created_at.to_s)
          @start_date = date_parse(@booking.start_date.to_s)
          @end_date = date_parse(@booking.end_date.to_s)
          @days_booked = (@booking.end_date - @booking.start_date).to_i
          if @booking.charges[0] 
            @amount = sprintf('%.2f', @booking.charges[0].amount)
            @complete = @booking.charges[0].complete
            @charge_status = @booking.charges[0].status
          else 
            @amount = "0.00"
            @complete = false
          end
          render 'api/bookings/show'
        else 
          render json: {
            success: false 
          }
        end   
      end
  
      private
  
      def date_parse(date)   
        new_date = Date.parse(date)
        return new_date.strftime('%A, %b %d, %Y')
      end

      def booking_params
        params.require(:booking).permit(:property_id, :start_date, :end_date, :status)
      end
    end
  end