class AddPaymentIntentToCharges < ActiveRecord::Migration[5.2]
  def change
    add_column :charges, :payment_intent, :string
  end
end
