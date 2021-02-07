json.charge do
    json.checkout_session_id @charge.checkout_session_id
    json.currency @charge.currency
    json.amount @charge.amount
    json.complete @charge.complete
    json.created_at @charge.created_at
    json.updated_at @charge.updated_at
end