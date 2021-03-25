module Api
    class ChargesController < ApplicationController
      skip_before_action :verify_authenticity_token, only: [:mark_complete]

      def create
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { error: 'user not logged in' }, status: :unauthorized if !session
  
        booking = Booking.find_by(id: params[:booking_id])
        return render json: { error: 'cannot find booking' }, status: :not_found if !booking
  
        property = booking.property
        days_booked = (booking.end_date - booking.start_date).to_i
        amount = days_booked * property.price_per_night
        
        booking.charges.none? || booking.charges.destroy_all

        session = Stripe::Checkout::Session.create(
          payment_method_types: ['card'],
          line_items: [{
            name: "Trip for #{property.title}",
            description: "Your booking is for #{booking.start_date} to #{booking.end_date}.",
            amount: (amount * 100.0).to_i, # amount in cents
            currency: "usd",
            quantity: 1,
          }],
          success_url: "#{ENV['URL']}/booking/#{booking.id}/success",
          cancel_url: "#{ENV['URL']}#{params[:cancel_url]}",
        )

        #booking.charges.none? || booking.charges.destroy
          @charge = booking.charges.new({
            checkout_session_id: session.id,
            payment_intent: session.payment_intent,
            currency: 'usd',
            amount: amount,
            status: "Pending",
          })
        


        if @charge.save
          render 'api/charges/create', status: :created
        else
          render json: { error: 'charge could not be created' }, status: :bad_request
        end
      end

      def refund
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { error: 'user not logged in' }, status: :unauthorized if !session
  
        @booking = Booking.find_by(id: params[:booking_id])
        return render json: { error: 'cannot find booking' }, status: :not_found if not @booking

        @charge = Charge.find_by(booking_id: params[:booking_id])
        return render json: { error: 'cannot find charge' }, status: :not_found if not @charge

        property = @booking.property
        days_booked = (@booking.end_date - @booking.start_date).to_i

        if @charge.status = 'Paid'
          begin 
            refund = Stripe::Refund.create({
              payment_intent: @charge.payment_intent,
            })

            if refund.status = 'succeeded'
              @booking.update_attribute(:status, 'Cancelled')
              @charge.update_attribute(:status, 'Refunded')

              render json: {
                success: true,
                status: :ok,
              }
            end
          rescue Stripe::InvalidRequestError
              render json: {
                success: true,
                message: "Invalid Request Error: No Charge to Refund" ,
              }
          end
        else 
          return render json: { status: 'not pending' }
        end
      end
   

      def mark_complete
        # You can find your endpoint's secret in your webhook settings
        
        endpoint_secret = ENV['STRIPE_MARK_COMPLETE_WEBHOOK_SIGNING_SECRET']
  
        payload = request.body.read
        event = nil
  
        # Verify webhook signature and extract the event
        # See https://stripe.com/docs/webhooks/signatures for more information.
        sig_header = request.env['HTTP_STRIPE_SIGNATURE']
        begin
          event = Stripe::Webhook.construct_event(
            payload, sig_header, endpoint_secret
          )
        rescue JSON::ParserError => e
          # Invalid payload
          return head :bad_request
        rescue Stripe::SignatureVerificationError => e
          # Invalid signature
          return head :bad_request
        end
  
        # Handle the checkout.session.completed event
        if event['type'] == 'checkout.session.completed'
          session = event['data']['object']
            
          # Fulfill the purchase, mark related charge as complete
          @charge = Charge.find_by(checkout_session_id: session.id)
          @booking = Booking.find_by(charges: @charge)

          return head :bad_request if not @charge
          return head :bad_request if not @booking
          @booking.update_attribute(:status, 'Confirmed')
          @charge.update_attribute(:status, 'Paid')
            
          return head :ok
        end
        
        return head :bad_request
      end

    def get_user_charges
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized if !session

      user = session.user 
      @charges = user.charges.all 

      return render json: { error: 'No charges for user' }, status: :not_found if not @charges
      render 'api/charges/index'        
    end

    def get_charge
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized if !session

      user = session.user 
      
      @charge = Charge.find_by(booking_id: params[:booking_id])
      return render json: { error: 'No charge for booking ID' }, status: :not_found if not @charge
      @booking = Booking.find_by(charges: @charge)
      @charge_user = User.find_by(bookings: @booking)
      return render json: { error: 'No charge user match ' }, status: :not_found if not @charge_user

      if @charge_user == user
        render 'api/charges/show'        
      else 
        render json: {
          success: false,
        }
      end
    end

    end
  end