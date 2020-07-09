# frozen_string_literal: true

Rails.application.routes.draw do
  resources :users, only: %i[index create]
  resources :games, only: :create
  post 'login', to: 'authentication#login'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
