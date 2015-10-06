#!/bin/env ruby
# encoding: utf-8

require 'rubygems'
require 'nokogiri'
require 'open-uri'
require 'mysql'

PAGE_URL = "http://www.aozora.gr.jp/cards/000052/files/5017_9759.html"

page = Nokogiri::HTML(open(PAGE_URL))

begin
  db = Mysql.init
  db.options Mysql::SET_CHARSET_NAME, "utf8"
  db.connect "localhost", "root", "", "book analysis"
  db.query "SET NAMES utf8" 
  
  text = page.css("div.main_text").text
  text.split("").each do |char|
    puts char
    result_set = db.query "SELECT * FROM characters WHERE kanji = '#{char}' ORDER BY id DESC"
    if result_set.num_rows == 0
      db.query "INSERT INTO characters VALUES('','#{char}','1')" 
    else
      db.query "UPDATE characters SET frequency = frequency + 1 WHERE kanji = '#{char}'" 
    end
  end
rescue Mysql::Error => e
  puts e.errno
  puts e.error
ensure
  db.close if db
end
