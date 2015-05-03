class PhotosController < ApplicationController
  def create
  	@photo = Photo.create(photo_params)
  	redirect_to root_url
  	# send_file 'public/' + @photo.photo_url, type: 'image/png', disposition: 'inline'
  	# @photo.photo_url
  end

  
  private
  	def photo_params
  		params.require(:photo).permit(:name,:photo_url,:user_id)
  	end
end
