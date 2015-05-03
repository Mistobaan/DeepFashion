class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.string :name
      t.string :photo_url
      t.integer :user_id

      t.timestamps null: false
    end
  end
end
