class AddStatusToCharges < ActiveRecord::Migration[5.2]
  def change
    add_column :charges, :status, :string
  end
end
