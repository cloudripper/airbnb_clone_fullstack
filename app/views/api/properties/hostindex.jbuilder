json.properties do
  json.array! @properties do |property|
    json.id property.id
    json.title property.title
    json.city property.city
    json.country property.country
    json.property_type property.property_type
    json.price_per_night property.price_per_night
    json.image do
      if property.images.attached?
        json.array property.images.map{|img| ({ image: img.service_url })}
      else 
        json.seed property.image_url
      end
    end
  end
end