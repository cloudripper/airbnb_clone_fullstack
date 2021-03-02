module Api
  class UsersController < ApplicationController
    def create
      @user = User.new(user_params)

      if @user.save
          render 'api/users/create', status: :created
        else
          render json: { success: false }, status: :bad_request
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
        return render 'bad_request', status: :bad_request if not @user.update(host_status: params[:user][:host_status])
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
      params.require(:user).permit(:email, :password, :username, :host_status)
    end
  end
end
