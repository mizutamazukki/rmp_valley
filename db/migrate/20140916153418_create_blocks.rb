class CreateBlocks < ActiveRecord::Migration
  def change
    create_table :blocks do |t|
      t.string :name
      t.text :desc

      t.timestamps
    end
  end
end
