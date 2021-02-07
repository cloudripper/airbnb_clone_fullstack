module Api
    class BookingsController < ApplicationController
      def create
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { error: 'user not logged in' }, status: :unauthorized if !session
  
        property = Property.find_by(id: params[:booking][:property_id])
        return render json: { error: 'cannot find property' }, status: :not_found if !property
  
        begin
          @booking = Booking.create({ user_id: session.user.id, property_id: property.id, start_date: params[:booking][:start_date], end_date: params[:booking][:end_date]})
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
############
        if params[:user_id] == user.user_id
          @bookings = user.bookings.all
          render 'api/bookings/index'
        else 
          render json: {
            success: false 
          }
        end
#################      
      end 

      def get_booking
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { success: false } unless session

        user = session.user
        
        if params[:user_id] == user.user_id
          @booking = user.bookings.find_by(id: params[:id])
          return render json: { error: 'cannot find booking' }, status: :not_found if not @booking
          render 'api/bookings/show'
        else 
          render json: {
            success: false 
          }
        end   
      end
  
      private
  
      def booking_params
        params.require(:booking).permit(:property_id, :start_date, :end_date)
      end
    end
  end