class UsersController < ApplicationController
  def new
  	@user = User.new
  end

  def show
  	@user = User.find(params[:id])
  end

  def create
    @user = User.new(user_params)
    if @user.save
    	# UserMailer.account_activation(@user).deliver_now
    	@user.send_activation_email
			flash[:info] = "Please check your email to activate your account."
			redirect_to root_url    	
      # Handle a successful save.
    else
      render 'new'
    end
  end

  private

    def user_params
      params.require(:user).permit(:name, :email, :password,
                                   :password_confirmation)
    end
end
