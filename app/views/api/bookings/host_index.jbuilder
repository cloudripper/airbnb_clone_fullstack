json.bookings do
    json.array! @bookings do |booking|
      json.id booking.id
      json.start_date booking.start_date
      json.end_date booking.end_date
      json.prop_title booking.property.title
      json.property_id booking.property_id
      json.charge booking.charges
      json.status booking.status
      json.user booking.user
      json.username booking.user.username
    end 
  end