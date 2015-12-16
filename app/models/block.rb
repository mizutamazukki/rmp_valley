class Block < ActiveRecord::Base
  def self.get_block_info block_ids
    block_info = Block.where(id:block_ids)
    return block_info
  end

  def self.get_block_info_by_stage_id stage_id
    block_info = Block.where(stage_id:stage_id)
    return block_info
  end
end
