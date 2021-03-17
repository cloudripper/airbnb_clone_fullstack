class User < ApplicationRecord
  has_many :sessions
  has_many :properties
  has_many :bookings

  validates :username, presence: true, length: { minimum: 3, maximum: 64 }
  validates :password, presence: true, length: { minimum: 8, maximum: 64 }
  validates :email, presence: true, length: { minimum: 5, maximum: 500 }
  validates :phone, length: { maximum: 13 }
  validates :first_name, length: { maximum: 35 }
  validates :last_name, length: { maximum: 35 }
  validates :bio, length: { maximum: 2000 }

  validates_uniqueness_of :username
  validates_uniqueness_of :email

  after_validation :hash_password
  
  has_many_attached :images

  def image_url
    if self.images.attached?
      self.images do |image|
        json.image image.service_url
      end
      #self.images.image.service_url
    else
      nil
    end
  end

  private

  def hash_password
    self.password = BCrypt::Password.create(self.password)
  end
end
