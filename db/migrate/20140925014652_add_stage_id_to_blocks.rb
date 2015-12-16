class AddStageIdToBlocks < ActiveRecord::Migration
  def change
    #どのステージでブロックを入手できるかデータ
    add_column :blocks, :stage_id, :integer, :default => 0, :null=>false,:unsigned => true
    add_index :blocks,[:stage_id],:name => 'stage_id_idx'
  end
end
