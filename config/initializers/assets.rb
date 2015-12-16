# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
Rails.application.config.assets.precompile += %w( enchant.js )
Rails.application.config.assets.precompile += %w( top_page.css )
Rails.application.config.assets.precompile += %w( story_game.css )
Rails.application.config.assets.precompile += %w( devise.css )
Rails.application.config.assets.precompile += %w( error.css )
Rails.application.config.assets.precompile += %w( classie.js )
Rails.application.config.assets.precompile += %w( component.css )