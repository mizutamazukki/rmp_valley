class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :email
      t.integer :stage,:null => false,:default => 1

      t.timestamps
    end
  end
end
