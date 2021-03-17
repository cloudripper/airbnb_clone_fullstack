require "image_processing/mini_magick"
module Api
  class UsersController < ApplicationController
    

    def create
      @user = User.new(user_params)

      if @user.save!
          render 'api/users/create', status: :created
        else
          render json: { success: false }, status: :bad_request
      end
    end

    def img_update
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { success: false } unless session

      @user = session.user
      
      if @user 
        @user.images.attached? && @user.images.purge 
        
        path = params[:user][:images].tempfile.path
        processed = ImageProcessing::MiniMagick
          .source(path)
          .resize_to_limit(300, 400)
          .strip
          .call(destination: path)
          
        @user.images.attach(params[:user][:images]) 

        path = params[:user][:images].tempfile.path
        processed = ImageProcessing::MiniMagick
          .source(path)
          .resize_to_limit(300, 400)
          .strip
          .quality('50')
          .blur('0x4')
          .call(destination: path)

        @user.images.attach(params[:user][:images]) 

        if @user.images.attached?
          render 'api/users/show'
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

      @user = session.user

      #@user.update_attribute(host_status: params[:user][:host_status])

      if @user[:user_id] == params[:user][:user_id]
          if (params[:bio])
            @user.update_attribute(:bio, params[:bio])
          end 
          if (params[:first_name])
            @user.update_attribute(:first_name, params[:first_name])
          end 
          if (params[:last_name])
            @user.update_attribute(:last_name, params[:last_name])
          end 
          if (params[:phone])
            @user.update_attribute(:phone, params[:phone])
          end 
          if (params[:username])
            @user.update_attribute(:username, params[:username])
          end 
          return render 'api/users/show'
      else 
        render json: {
          success: @user,
          error: "User authentication failure"
        }
      end
    end

    def show_auth 
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { success: false } unless session

      @user = session.user
  
      return render 'bad_request', status: :bad_request if not @user
      render 'api/users/show', status: :ok
    end

    def show 
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { success: false } unless session

      @user = User.find_by(id: params[:user_id])
      
      if @user 
         render 'api/users/show', status: :ok
      else 
        render json: { user: @user, success: false }, status: :bad_request
      end
    end

    def host_update
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { success: false } unless session

      @user = session.user

      #@user.update_attribute(host_status: params[:user][:host_status])

      if @user[:user_id] == params[:user][:user_id]
        return render 'bad_request', status: :bad_request if not @user.update_attribute(:host_status, params[:user][:host_status])
        render 'api/users/show', status: :ok
      else 
        render json: {
          success: false,
          error: "User authentication failure"
        }
      end
    end

    def destroy
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { success: false } unless session

      user = session.user
  
      if user.destroy
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

    private

    def user_params
      params.require(:user).permit(:email, :password, :username, :host_status, :images, :first_name, :last_name, :bio, :phone)
    end
  end
end
