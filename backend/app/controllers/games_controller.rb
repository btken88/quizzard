# frozen_string_literal: true

class GamesController < ApplicationController
  before_action :authorize, only: :create

  def create
    @game = Game.create({
                          user_id: @user.id,
                          score: params[:score]
                        })
    render json: { game: @game }, status: :created
  end

  private

  def authorize
    header = request.headers['Authorization']
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
