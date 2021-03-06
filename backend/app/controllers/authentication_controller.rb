# frozen_string_literal: true

class AuthenticationController < ApplicationController
  def login
    @user = User.find_by username: params[:username]

    if !@user
      render json: { error: 'Authentication failed.' }, status: :unauthorized
    else
      if !@user.authenticate params[:password]
        render json: { error: 'Authentication failed!' }, status: :unauthorized
      else
        payload = { user_id: @user.id }
        secret = Rails.application.secret_key_base
        token = JWT.encode payload, secret
        render json: { token: token, user: @user }
      end
    end
  end
end
