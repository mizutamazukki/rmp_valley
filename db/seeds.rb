# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)


#User model
User.create(:name=>"yanagisawa",:email=>"yanagisawa@gmail.com",:password=>"yanagisawa",:stage=>3)
User.create(:name=>"zukky",:email=>"zukky@gmail.com",:password=>"zukky",:stage=>1)
User.create(:name=>"tunasan",:email=>"tunasan@gmail.com",:password=>"tunasa",:stage=>2)
User.create(:name=>"wata",:email=>"wata@gmail.com",:password=>"wata",:stage=>1)

#User_block model
UserBlock.create(:user_id=>1,:block_id=>1)
UserBlock.create(:user_id=>1,:block_id=>2)
UserBlock.create(:user_id=>1,:block_id=>3)
UserBlock.create(:user_id=>1,:block_id=>4)
UserBlock.create(:user_id=>1,:block_id=>5)
UserBlock.create(:user_id=>2,:block_id=>1)
UserBlock.create(:user_id=>3,:block_id=>1)
UserBlock.create(:user_id=>3,:block_id=>2)
UserBlock.create(:user_id=>4,:block_id=>1)

#Block
Block.create(:name=>"前にすすむ",:desc=>"前に進むブロックだよ このブロックを置くとキャラクターが前に進むよ",:stage_id=>"0")
Block.create(:name=>"向きを変える",:desc=>"キャラクターの向きを変えるよ 後ろに進みたいときはこのブロックを使おう",:stage_id=>1)
Block.create(:name=>"ジャンプする",:desc=>"ジャンプするブロックだよ 何かを飛び越えたい時に役に立つぞ！",:stage_id=>1)
Block.create(:name=>"もしもの処理",:desc=>"右側に出てくるボタンからどの時に処理をさせたいのかを選ぼう！",:stage_id=>2)
Block.create(:name=>"繰り返し",:desc=>"条件が満たされるまで同じ処理を何度も繰り返すよ うまく使えばすごい便利だぞ！",:stage_id=>2)
