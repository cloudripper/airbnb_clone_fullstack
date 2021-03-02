json.user do
  json.user_id @user.id
  json.username @user.username
  json.email @user.email
  json.host_status @user.host_status
  json.created_at @user.created_at
end
