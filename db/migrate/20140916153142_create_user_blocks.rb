class CreateUserBlocks < ActiveRecord::Migration
  def change
    create_table :user_blocks do |t|
      t.integer :user_id
      t.integer :block_id

      t.timestamps
    end
  end
end
