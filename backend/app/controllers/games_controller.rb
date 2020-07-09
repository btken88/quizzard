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
end
