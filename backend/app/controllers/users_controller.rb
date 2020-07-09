# frozen_string_literal: true

class UsersController < ApplicationController
  validates :username, uniqueness: true

  def show
    @user = User.find(params[:user_id])
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
