class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session
  before_action :authenticate_user!

  before_filter :configure_permitted_parameters, if: :devise_controller?

  protect_from_forgery with: :exception

  rescue_from ActiveRecord::RecordNotFound, with: :render_404
  rescue_from ActionController::RoutingError, with: :render_404
  rescue_from Exception, with: :render_500

  def after_sign_in_path_for resource
    "/map"
  end

  def after_sign_up_path_for resource
    "/map"
  end

  def after_sign_out_path_for resource
    p "hoge"
    "/users/sign_in"
  end

  def render_404(exception = nil)
    if exception
      logger.info "Rendering 404 with exception: #{exception.message}"
    end
    render template: "errors/error_404", status: 404, layout: 'application'
  end

  def render_500(exception = nil)
    if exception
      logger.info "Rendering 500 with exception: #{exception.message}"
    end
    render template: "errors/error_500", status: 500, layout: 'application'
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.for(:sign_up) << :name 
  end

  private 

  def require_login_user 
    unless user_signed_in?
      redirect_to "/users/signed_in"
    end
  end

end
