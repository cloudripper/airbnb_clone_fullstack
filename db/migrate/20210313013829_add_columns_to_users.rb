class AddColumnsToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :phone, :integer
    add_column :users, :bio,   :string
    add_column :users, :first_name,  :string
    add_column :users, :last_name,  :string
    add_column :users, :identity_conf,  :boolean
  end
end