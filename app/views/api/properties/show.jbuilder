json.property do
    json.id @property.id
    json.title @property.title
    json.description @property.description
    json.city @property.city
    json.country @property.country
    json.property_type @property.property_type
    json.price_per_night @property.price_per_night
    json.max_guests @property.max_guests
    json.bedrooms @property.bedrooms
    json.beds @property.beds
    json.baths @property.baths
    json.image_url @property.image_url
    json.success true
   # json.image  @property.images.map{|img| ({ image: img.service_url })}
    json.image do
      if @property.images.attached?
        json.array @property.images.map{|img| ({ image: img.service_url })}
      else 
        json.seed @property.image_url
      end
    end

    json.user do
      json.id @property.user.id
      json.username @property.user.username
    end
  end