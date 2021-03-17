Rails.application.routes.draw do
  root to: 'static_pages#app'

  #get '/property/:id' => 'static_pages#property'
 
 # get '/login' => 'static_pages#login'

  namespace :api do
    # Add routes below this line
    resources :users, only: [:create, :update, :destroy, :show]
    resources :sessions
    resources :properties, only: [:index, :show, :create, :update, :destroy]
    resources :bookings, only: [:create, :update, :destroy]
    resources :charges, only: [:create, :refund]

    get '/properties/:id/bookings' => 'bookings#get_property_bookings'
    get '/authenticated' => 'sessions#authenticated'
    get '/login' => 'users#show_auth'

    post '/charges/mark_complete' => 'charges#mark_complete'

    #Feature additions
    post '/sessions' => 'sessions#create'
    post '/users' => 'users#create'
    get '/users/show/:user_id' => 'users#show'
    put '/users/update/avatar/:user_id' => 'users#img_update'
    put '/users/update/:user_id' => 'users#update'
    get '/bookings/:user_id' => 'bookings#get_user_bookings'
    get '/bookings/:user_id' => 'bookings#get_user_bookings'
    get '/bookings/:user_id/:id' => 'bookings#get_booking'
    post '/properties/:user_id' => 'properties#create'
    put '/properties/:id/update/img' => 'properties#img_update'
    get '/charges/:booking_id' => 'charges#get_charge'
    get '/user/charges' => 'charges#get_user_charges'
    delete '/sessions' => 'sessions#destroy'  
    delete '/charges/:booking_id' => 'charges#refund'
    put '/charges/:booking_id' => 'charges#update'
    delete '/booking/:booking_id' => 'bookings#destroy'  
    get '/host/properties/:user_id' => 'properties#get_user_properties'
    put '/users/host/:user_id' => 'users#host_update'
    get '/host/bookings' => 'bookings#get_host_bookings_index'


  end
  get '/*uri', action: :app, controller: 'static_pages'
end