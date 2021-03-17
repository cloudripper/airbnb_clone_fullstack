json.user do
  json.user_id @user.id
  json.username @user.username
  json.email @user.email
  json.host_status @user.host_status
  json.created_at @user.created_at
  
  json.phone  @user.phone
  json.bio  @user.bio
  json.first_name  @user.first_name
  json.last_name  @user.last_name
  json.identity_conf  @user.identity_conf
  json.success true
  json.image @user.images.map{|img| ({ image: img.service_url })}
  #json.image  do
  #  json.array! @user.images do |image|
  #    json.image image.image_url 
  #  end
  #end
end