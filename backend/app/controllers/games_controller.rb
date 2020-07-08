# frozen_string_literal: true

class GamesController < ApplicationController
  def index
    @games = Game.all
    render json: { games: @games }
  end

  def create
    @game = game.create({
                          user_id: @user.id,
                          score: params[:score]
                        })
  end
end
