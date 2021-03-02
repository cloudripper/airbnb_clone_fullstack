class AddHostStatusToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :host_status, :boolean
  end
end
