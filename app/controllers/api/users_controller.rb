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

    def show 
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { success: false } unless session

      @user = session.user
  
      return render 'bad_request', status: :bad_request if not @user
      render 'api/users/show', status: :ok
    end

    def update 
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { success: false } unless session

      user = session.user
  
      return render 'bad_request', status: :bad_request if not user.update(user_params)
      render 'api/users/show', status: :ok
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
      params.require(:user).permit(:email, :password, :username)
    end
  end
end
