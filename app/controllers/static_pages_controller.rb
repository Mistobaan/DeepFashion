class StaticPagesController < ApplicationController
  require 'open3'

  def home
  	
  end

  def call
    # testing success
    # This is able to return the print statement from the python script
    result = `python python/print.py`
  	puts "#{result}"
  	separate = result.split(",")
  	puts separate[0]
  	puts separate[1]
  	puts separate[2]
    # file = File.read('myData.json')
    # data_hash = JSON.parse(file)
    # puts data_hash

    results = `python python/clothesAdvisor.py`
    puts results

    # attempts open3
    # Open3.popen3(%{python python/print.py}) {|stdin, stdout, stderr|
    #   output = stdout.read()
    #   error = stderr.read()
    #   # FIXME: don't want to *separate out* stderr like this
    #   repr = "$ python python/print.py\n#{output}"
    #   puts repr
    # }
  	redirect_to root_url
  end 

  def run
    output = `print 'a'`
    puts output
    # try = `advisor.evaluateClothes('lg-4835.jpg')`
    # puts try
    redirect_to root_url
  end

end
