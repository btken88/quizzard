# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authorize, only: :index

  def index
    render json: @user, include: :games
  end

  def create
    @user = User.create(user_params)

    render json: { user: @user }, status: :created
  end

  private

  def user_params
    params.require(:username, :password)
  end
end
