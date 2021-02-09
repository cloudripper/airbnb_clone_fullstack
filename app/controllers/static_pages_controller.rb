class StaticPagesController < ApplicationController
  def app
    render 'app'
  end

  def property
    @data = { property_id: params[:id] }.to_json
    render 'property'
  end

  def login 
    render 'login'
  end
end
