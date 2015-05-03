class PhotosController < ApplicationController
  def create
  	@photo = Photo.create(photo_params)
  	respond_to do |format|
  		if @photo.save
        response = Unirest.get "https://api.zalando.com/articles", headers:{ "Accept" => "application/json" }, parameters:{:category=>"clothing"}
  		  @list = response.body["content"]
        @list.each do |item|
          puts item["id"]
        end
        format.js
      end
  	end
  end
  
  private
  	def photo_params
  		params.require(:photo).permit(:name,:photo_url,:user_id)
  	end
end
