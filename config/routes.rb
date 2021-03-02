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
    post '/api/sessions' => 'sessions#create'
    get '/users/show/:user_id' => 'users#show'
    get '/bookings/:user_id' => 'bookings#get_user_bookings'
    get '/bookings/:user_id' => 'bookings#get_user_bookings'
    get '/bookings/:user_id/:id' => 'bookings#get_booking'
    get '/properties/:user_id' => 'properties#get_user_properties'
    get '/charges/:booking_id' => 'charges#get_charge'
    get '/user/charges' => 'charges#get_user_charges'
    delete '/sessions' => 'sessions#destroy'  
    delete '/charges/:booking_id' => 'charges#refund'
    put '/charges/:booking_id' => 'charges#update'
    put '/users/host/:user_id' => 'users#host_update'
    delete '/booking/:booking_id' => 'bookings#destroy'  
    

  end
  get '/*uri', action: :app, controller: 'static_pages'
end