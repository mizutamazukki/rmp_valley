class StoryGameController < ApplicationController
  require 'json'
  before_filter :require_login_user 

  def showStoryGamePage

    @stageNum = params[:stageNum].to_i

    if current_user.stage >= @stageNum &&  @stageNum <= 20
      game_scene_map_json_file_path = "#{Rails.root}/app/data/stage/map_"+params[:stageNum]+".json"
      start_scene_map_json_file_path = "#{Rails.root}/app/data/stage/start_scene_map_"+params[:stageNum]+".json"

      #map data
      gon.map = JSON.parse(File.read(game_scene_map_json_file_path))
      gon.start_scene_map= JSON.parse(File.read(start_scene_map_json_file_path))

      #hint data
      hint_file_path = "#{Rails.root}/app/data/hint/hint_stage_"+params[:stageNum]+".json"
      gon.hint = JSON.parse(File.read(hint_file_path))

      #hint data
      goal_pos_file_path = "#{Rails.root}/app/data/stage/goal_pos.json"
      gon.goal_pos = JSON.parse(File.read(goal_pos_file_path))[@stageNum-1]

      @user_blocks = UserBlock.get_user_blocks(current_user.id)

      #ブロックを新しく取得した場合にjavascript側で
      #取得したブロックをポップアップで表示
      if current_user.stage == @stageNum
        gon.new_block_user_can_get = Block.get_block_info_by_stage_id(@stageNum)
      end

      blockIds = []

      @user_blocks.each do |block|
        blockIds.push(block.block_id)
      end

      @blocks = Block.get_block_info(blockIds)

      render :action => "index"
    else
      render :template => "errors/error_404"
    end


  end


  def updateUserStageData
    render :action => "index"
  end
end
