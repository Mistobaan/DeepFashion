class PhotosController < ApplicationController
  def create
  	@photo = Photo.create(photo_params)
  	respond_to do |format|
  		if @photo.save
        response = Unirest.get "https://api.zalando.com/articles", headers:{ "Accept" => "application/json" }, parameters:{:category=>"clothing"}
  		  @list = response.body["content"]

        # puts @photo.photo_url
        # puts "escape following"
        # puts URI.escape(@photo.photo_url.to_s)
        # puts "encode following"
        # puts URI.encode(@photo.photo_url.to_s)
        # post to tag uploade file

        #get call to tag online photo

        url =  @photo.photo_url.to_s
        puts url
        split = url.split("/")
        size = split.size
        puts split[size-1]
        alchemy = Unirest.get 'http://access.alchemyapi.com/calls/url/URLGetRankedImageKeywords',headers:{ "Accept" => "application/json" }, parameters:{:apikey=>"0bea1d02e8c4a8c86def3dbd5f7b385d59a4d7ca", :url =>"http://deepfashion.org/image/" + split[size-1], :outputMode=>"json"}
        keywords = alchemy.body["imageKeywords"]
        puts "cloth keywords are:"
        keywords.each do |key|
          puts key["text"]
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
