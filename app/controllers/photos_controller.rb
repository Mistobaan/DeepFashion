class PhotosController < ApplicationController
  def create
  	@photo = Photo.create(photo_params)
  	respond_to do |format|
  		if @photo.save
  			format.js
  		end
  	end
  end
  
  private
  	def photo_params
  		params.require(:photo).permit(:name,:photo_url,:user_id)
  	end
end
