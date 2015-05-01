class StaticPagesController < ApplicationController
  def home
  	
  end

  def call
  	system 'echo hi'
    result = `python python/print.py`
  	puts "#{result}"
  	# returned is a string separated by comma
  	separate = result.split(",")
  	puts separate[0]
  	puts separate[1]
  	puts separate[2]
    # file = File.read('myData.json')
    # data_hash = JSON.parse(file)
    # puts data_hash
    clothes = `python python/clothesAdvisor.py`

    
  	redirect_to root_url

  end 
end
