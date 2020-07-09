# frozen_string_literal: true

class ApplicationController < ActionController::API
  def authorize
    header = request.headers['Authorization']
    puts request.headers['Authorization']
    token = header.split(' ')[1]
    if !token
      render json: { error: 'User not authorized' }, status: :forbidden
    else
      begin
        secret = Rails.application.secret_key_base
        payload = JWT.decode(token, secret)[0]
        @user = User.find payload['user_id']
      rescue StandardError
        render json: { error: 'User not authorized' }, status: :forbidden unless @user
      end
    end
  end
end
