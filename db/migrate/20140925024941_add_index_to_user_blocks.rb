class AddIndexToUserBlocks < ActiveRecord::Migration
  def change
    #どのステージでブロックを入手できるかデータ
    add_index :user_blocks,[:user_id],:name => 'user_id_idx'
    add_index :user_blocks,[:user_id,:block_id],:name => 'user_id_block_id_idx',:unique => true
  end
end
