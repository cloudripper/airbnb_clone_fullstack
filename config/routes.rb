Rails.application.routes.draw do
  root to: 'static_pages#home'

  get '/property/:id' => 'static_pages#property'
  get '/login' => 'static_pages#login'

  namespace :api do
    # Add routes below this line
    resources :users, only: [:create, :update, :destroy]
    resources :sessions, only: [:create, :destroy]
    resources :properties, only: [:index, :show, :create, :update, :destroy]
    resources :bookings, only: [:create, :update, :destroy]
    resources :charges, only: [:create, :refund]

    get '/properties/:id/bookings' => 'bookings#get_property_bookings'
    get '/authenticated' => 'sessions#authenticated'

    post '/charges/mark_complete' => 'charges#mark_complete'

    #Feature additions
    get '/bookings/:user_id' => 'bookings#get_user_bookings'
    get '/bookings/:user_id/:id' => 'bookings#get_booking'
    get '/properties/:user_id' => 'properties#get_user_properties'
    get '/charges/:booking_id' => 'charges#get_charge'
    get '/user/charges' => 'charges#get_user_charges'


  end

end