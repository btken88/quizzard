# frozen_string_literal: true

Rails.application.routes.draw do
  resources :users, only: :create
  resources :games, only: %i[index create]
  post "login", to: "authentication#login"
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
