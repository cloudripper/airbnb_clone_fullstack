module Api
    class PropertiesController < ApplicationController
      def index
        @properties = Property.order(created_at: :desc).page(params[:page]).per(6)
        return render json: { error: 'not_found' }, status: :not_found if !@properties
  
        render 'api/properties/index', status: :ok
      end
  
      def show
        @property = Property.find_by(id: params[:id])
        return render json: { error: 'not_found' }, status: :not_found if !@property
  
        render 'api/properties/show', status: :ok
      end

      def create
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { success: false } unless session

        user = session.user
        @property = user.properties.new(property_params)

        if @property.save
          render 'api/properties/show', status: :ok, success: true
        end
      end

      def img_update
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { success: false } unless session
        @property = Property.find_by(id: params[:id])
        @user = session.user
        
        if @user.id == @property.user.id
          @property.images.attached? && @property.images.purge 
          path = params[:property][:images].tempfile.path
          processed = ImageProcessing::MiniMagick
            .source(path)
            .resize_to_limit(2500, 1400)
            .strip
            .call(destination: path)
          @property.images.attach(params[:property][:images]) 

          path = params[:property][:images].tempfile.path
          processed = ImageProcessing::MiniMagick
            .source(path)
            .strip
            .quality('30')
            .blur('0x8')
            .call(destination: path) 
          @property.images.attach(params[:property][:images]) 
          if @property.images.attached?
            render 'api/properties/show', status: :ok, success: true
          else 
            return render json: { success: false, status: :bad_request } 
          end
  
        else 
          render json: {
            success: false,
            error: "User authentication failure"
          }
        end
      end

      def update 
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { success: false } unless session

        user = session.user
        @property = user.properties.find_by(id: params[:id])

        return render 'not_found', status: :not_found if not @property
        return render 'bad_request', status: :bad_request if not @property.update(property_params)
        render 'api/properties/show', status: :ok
      end

      def destroy 
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { success: false } unless session
        
        user = session.user
        property = Property.find_by(id: params[:id])

        if property and property.user == user and property.destroy
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

      def get_user_properties
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        return render json: { success: false } unless session
        
        user = session.user

        @properties = user.properties.all
        return render json: { error: 'No properties available' }, status: :not_found if not @properties
        render 'api/properties/hostindex'
      end

    def get_property_bookings
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { success: false } unless session
      
      user = session.user

      @properties = user.properties.all
      return render json: { error: 'No properties available' }, status: :not_found if not @properties
      render 'api/properties/hostindex'
    end


      private
    
      def property_params
          params.require(:property).permit(:title, :description, :city, :country, :property_type, :price_per_night, :max_guests, :bedrooms, :beds, :baths, :user, :images)
      end
    end
  end