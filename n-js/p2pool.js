var currency, currency_info, rate, local_stats, global_stats, current_payouts, recent_blocks, payout_addr;
var local_hashrate= 0, local_doa_hashrate= 0;
var jsonp = "./jsonp.php?callback=?";
var api_url = "";
if (typeof config === 'undefined') {
    // Config couldn't be loaded, prefill with some basic defaults
    config = {
        myself: [],
        host: '',
        reload_interval: 10,
        reload_chart_interval: 600,
        header_content_url: ''
    };
}

// Check if we shall remotely connect to a p2pool running somewhere
if (config.host && config.host.length > 0) {
    api_url = jsonp + '&host=' + encodeURI(config.host) + '&report=';
    $('#node').removeClass('hidden').text(config.host);
    $('#_node').removeClass('hidden');
}

// ==================================================================
// event handlers

$(document).ready(function() {
    $(document).trigger('init');

    if (config.header_content_url && config.header_content_url.length > 0) {
        $("#header_content").load(config.header_content_url);
    }
});

// toggle hashrate chart
$('#hour.hashrate').click(function(e) {
    fetchGraph('hour');
});
$('#day.hashrate').click(function(e) {
    fetchGraph('day');
});
$('#week.hashrate').click(function(e) {
    fetchGraph('week');
});
$('#month.hashrate').click(function(e) {
    fetchGraph('month');
});
$('#year.hashrate').click(function(e) {
    fetchGraph('year');
});

$('#setminers.btn').click(function(e) {
    setMyMiners();
});

// ==================================================================
// custom event handlers

// init
$(document).on('init', function(e, eventInfo) {
    fetchBlocks();
    fetchShares();
    fetchdata();
    fetchGraph('hour');
    fetchMyMiners();
    initThemes();

    // Define network by port number in URL
    if (window.document.location.port == 9171) {
      $('.network-num').text("1");
      $('#netlink1').addClass('is-active');
    } else if (window.document.location.port == 9181){
      $('.network-num').text("2");
      $('#netlink2').addClass('is-active');
    }
});

$(document).on('update', function(e, eventInfo) {
    fetchBlocks();
    fetchShares();
    fetchdata();
    fetchGraph('hour');
});

$(document).on('update_graph', function(e, eventInfo) {
    graphPeriod = chart.title.text.match(/\((.+)\)/)[1] || 'day';
    fetchGraph(graphPeriod);
});

// Fills the list of active miners on this node.  I know, there are
// zillions of people out there on p2pool.  But I'm typically only
// interested to see, who is mining on my node.
$(document).on('update_miners', function(e, eventInfo) {
    local_hashrate = 0;
    local_doa_hashrate = 0;
    total_miners = 0;

    // Sort by hashrate, highest first
    miners = sortByValue(local_stats.miner_hash_rates).reverse();
    clientMiners = (localStorage.miners && localStorage.miners.length > 0) ? localStorage.miners.split("\n") : [];

    // Added by Steve
    total_miners = Object.keys(local_stats.miner_hash_rates).length;
    $('#active-miners').text(total_miners);
    if (total_miners === 0 || total_miners > 1) {
      $('#active-miners-label').text("Miners");
    } else {
      $('#active-miners-label').text("Miner");
    }

    if (total_miners > 0) {$('#active_miners').find("tr:gt(0)").remove();}
    $.each(miners, function(_, address) {
        // Only display client miners if configured
        if (localStorage.onlyclientminers === 'true' && $.inArray(address, clientMiners) == -1) {
            return true;
        }

        hashrate = local_stats.miner_hash_rates[address];
        doa = local_stats.miner_dead_hash_rates[address] || 0;
        doa_prop = (parseFloat(doa) / parseFloat(hashrate)) * 100;

        if (doa_prop > 5) {
          tr = $('<tr/>').attr('id', address).addClass('c-table__row c-table__row--danger');
          doa_diff_label = 'danger';
          doa_diff_text = 'You may have high latency to this node in Dallas.';
        } else {
          tr = $('<tr/>').attr('id', address).addClass('c-table__row');
          doa_diff_label = "success";
          doa_diff_text = 'Lookin\' good!';
        }

        // Highlight client miner if configured
        if (localStorage.miners && localStorage.miners.length > 0 && $.inArray(address, clientMiners) >= 0) {
            tr.addClass('success');
        }
        // Highlight server miner if configured
        if (config.myself && config.myself.length > 0 && $.inArray(address, config.myself) >= 0) {
            tr.addClass('warning');
        }

        local_hashrate += hashrate || 0;
        local_doa_hashrate += doa  || 0;


        tr.append($('<td/>')
            .addClass('c-table__cell')
            .append('<a href="https://bitinfocharts.com/vertcoin/address/' + address + '" target="_blank">' + address + '</a>')
            .append(createAddressBadge(address))
        );

        tr.append($('<td/>')
            .addClass('c-table__cell')
            .append(formatHashrate(hashrate))
        );

        tr.append($('<td/>')
            .addClass('c-table__cell')
            .append(formatHashrate(doa) + ' <span class="c-tooltip c-tooltip--top u-text-' + doa_diff_label + '" aria-label="' + doa_diff_text + '">(' + doa_prop.toFixed(2) + '%)</span>')

        );

        // Miner Last Difficulties is non-standard p2pool data
        // Handle with care
        if (local_stats.miner_last_difficulties) {
            diff = local_stats.miner_last_difficulties ? (parseFloat(local_stats.miner_last_difficulties[address]) || 0) : 0;
            time_to_share = (parseInt(local_stats.attempts_to_share) / parseInt(hashrate) * (diff / parseFloat(global_stats.min_difficulty))) || 0;

            diff_variance_percent = ((1 - (global_stats.min_difficulty / diff)) * 100).toFixed(2);
            if (diff_variance_percent <= 20) {
              share_diff_label = "mute";
            } else {
              share_diff_label = "mute";
            }

            if (diff_variance_percent >= 0) {
              prepend_share_diff_label = "+";
            } else {
              prepend_share_diff_label = "";
            }

            tr.append($('<td/>')
                .addClass('c-table__cell')
                .append(diff.toFixed(2))
                .append(' <span class="c-tooltip c-tooltip--top u-text-' + share_diff_label + '" aria-label="Compared to network minimum difficulty of ' + global_stats.min_difficulty.toFixed(2) + '">(' + prepend_share_diff_label + diff_variance_percent + '%)</span>')
            );


            tr.append($('<td/>')
                .addClass('c-table__cell')
                .append(('' + time_to_share).formatSeconds())
            );

        }

        payout = current_payouts[address] || 0;

        if (payout) {
            td = $('<td/>').attr('class', 'c-table__cell')
                .text(parseFloat(payout).toFixed(8))
                .append(' ').append(currency.clone());
            tr.append(td);

            // Shares last 6 hours based on 30 min block averages, so let's assume
            // the shares persist for at least half that time.
            var daily_payout = payout * (recent_blocks.length);
            tr.append($('<td/>')
              .addClass('c-table__cell')
              .text(parseFloat(daily_payout).toFixed(8))
              .append(' ').append(currency.clone())
            );
        }
        else {
            tr.append($('<td/>').attr('class', 'c-table__cell')
                .append($('<span/>').append('No shares, yet! <a href="#"><i href="#" class="fa fa-question-circle" data-toggle="modal" data-target="#no-shares-modal"></i></a>').addClass("u-text-mute")));

            tr.append($('<td/>')
                .addClass('c-table__cell')
                .text("0.00 VTC"));
        }

        $('#active_miners').append(tr);
    });

    if (local_doa_hashrate !== 0 && local_hashrate !== 0) {
        doa_rate = (local_doa_hashrate / local_hashrate) * 100;
    }
    else {
        doa_rate= 0;
    }

    rate = formatHashrate(local_hashrate);
    $('#local_rate').text(rate);

    pool_hash_rate = parseInt(global_stats.pool_hash_rate || 0);
    pool_nonstale_hash_rate = parseInt(global_stats.pool_nonstale_hash_rate || 0);
    global_doa_rate = pool_hash_rate - pool_nonstale_hash_rate;

    global_rate = formatHashrate(pool_hash_rate);
    $('#global_rate').text(global_rate);

    // Network Hash Rate information is non-standard p2pool data
    // Handle with care
    if (global_stats.network_hashrate) {
        network_rate = formatHashrate(global_stats.network_hashrate);
        $('#network_rate').text(network_rate);
    }

    // Network Block Diff information is non-standard p2pool data
    // Handle with care
    if (global_stats.network_block_difficulty) {
        // Add diff button to the navbar if it doesn't already exist
        if ($('button .diff').length === 0) {
            var diff_button = $('<button/>')
                .attr('type', 'button')
                .addClass('btn navbar-btn btn-default btn-sm')
                .text('Diff: ')
                .append( $('<span/>').addClass('diff') );
            $('.navbar-right').children(":eq(1)").after(diff_button);
        }
        // Added by Steve
        $('#block-diff').text(parseFloat(global_stats.network_block_difficulty).toFixed(2));
        // Add diff bar to status area if it doesn't already exist
        if ($(".status li:contains('Network Block Difficulty')").length === 0) {
            var diff_row = $('<li/>')
                .addClass('list-group-item')
                .text('Network Block Difficulty: ')
                .append( $('<span/>').addClass('diff') );
            $('.status.share_info').children(':eq(1)').after(diff_row);
        }

        $('.diff').text(parseFloat(global_stats.network_block_difficulty).toFixed(2));
    }

    $('#share_difficulty').text(parseFloat(global_stats.min_difficulty).toFixed(2));
    $('#modal_share_difficulty').text(parseFloat(global_stats.min_difficulty).toFixed(2));

    $('#block_value')
        .text(parseFloat(local_stats.block_value).toFixed(8))
        .append(' ').append(currency.clone());

    // Added by Steve
    $('#block-reward')
      .text(parseFloat(local_stats.block_value).toFixed(2))
      .append(' ').append(currency.clone());

    $('#stats_blocks_found_daily').text(recent_blocks.length);
    $('#node_donation').text((local_stats.donation_proportion * 100) + '%');
    $('#node_fee').text(local_stats.fee + '%');
    $('#p2pool_version').text(local_stats.version);
    $('#protocol_version').text(local_stats.protocol_version);
    $('#peers_in').text(local_stats.peers.incoming);
    $('#peers_out').text(local_stats.peers.outgoing);
    $('#node_uptime').text(('' + local_stats.uptime).formatUptime());

    if (local_stats.warnings.length > 0) {
        $('#node_alerts').empty();

        $.each(local_stats.warnings, function(key, warning) {
            $('#node_alerts').append($('<p/>').append(warning));
        });

        $('#node_alerts').fadeIn(1000, function() {
            $(this).removeClass('hidden');
        });
    }
    else {
        if (! $('#node_alerts').hasClass('hidden')) {
            $('#node_alerts').fadeOut(1000, function() {
                $(this).addClass('hidden');
            });
        }
    }

    $('#shares')
        .text(local_stats.shares.total)
        .append(' <span class="u-text-mute">(Orphan: ' + local_stats.shares.orphan + ', Dead: ' + local_stats.shares.dead + ')<span>');

    if (local_hashrate !== 0) {
        time_to_share = (parseInt(local_stats.attempts_to_share) / parseInt(local_hashrate));
        $('#expected_time_to_share').text((''+time_to_share).formatSeconds());
    }
    else {
        $('#expected_time_to_share').html('&dash;');
    }

    attempts_to_block = parseInt(local_stats.attempts_to_block || 0);
    time_to_block = attempts_to_block / pool_hash_rate;
    $('#expected_time_to_block').text(('' + time_to_block).formatSeconds());

    // Remove the first placeholder row if we have payouts (we probably do)
    if ((Object.keys(current_payouts)).length > 0) { $('#current_payouts').find("tr:gt(0)").remove(); }

    // Sort the hash by Value
    var sortable_payouts = [];
    for (var address in current_payouts) {
        sortable_payouts.push([address, current_payouts[address]]);
    }

    sortable_payouts.sort(function(a, b) {
        return a[1] - b[1];
    });

    // Sort array to decending order
    sortable_payouts.reverse();

    var count = 0;
    $.each(sortable_payouts, function(index, value){
      $('#current_payouts')
          .append($('<tr/>')
            .addClass('c-table__row')
            .append($('<td/>')
              .addClass('c-table__cell')
              .append('<a href="https://bitinfocharts.com/vertcoin/address/' + value[0] + '" target="_blank">' + value[0] + '</a>')
              .append(createAddressBadge(value[0])))
            .append($('<td/>')
              .addClass('c-table__cell')
              .append(value[1]))
            );
      count++;
      if (count == 50){ return false; }
    });
});

// Fills the recent block table
$(document).on('update_blocks', function(e, eventInfo) {
    $('#recent_blocks').find('tbody tr').remove();

    $.each(recent_blocks, function(key, block) {
        ts = block.ts;
        num = block.number;
        hash = block.hash;

        // link to blockchain.info for the given hash
        blockinfo = $('<a/>')
            .attr('href', "https://bchain.info/VTC/block/" + hash)
            .attr('target', '_blank').text(num);
        pretty_date = $.format.prettyDate(new Date(ts * 1000));
        long_date = $.format.date(new Date(ts * 1000));

        tr = $('<tr/>').attr('id', num).addClass('c-table__row');
        tr.append($('<td/>').addClass("c-table__cell").append(blockinfo));
        tr.append($('<td/>').addClass("c-table__cell")
          .append('<span class="c-tooltip c-tooltip--top" aria-label="' + long_date + '">' + pretty_date + '<span>')
        );
        //tr.append($('<td/>').addClass("c-table__cell").append($.format.date(new Date(ts * 1000))));

        $('#' + num).remove();
        $('#recent_blocks').append(tr);
    });

    if (recent_blocks[0] !== null && recent_blocks[0].ts !== null) {
        $('#num_blocks_found').text(recent_blocks.length);
        $('#last_block').text( $.format.prettyDate(new Date(recent_blocks[0].ts * 1000)) );
        $('#last-block-found').text( $.format.prettyDate(new Date(recent_blocks[0].ts * 1000)) );
    }
    else {
        $('#last_block').text('No blocks found!');
    }
});

$(document).on('update_shares', function(e, eventInfo) {
  if (all_shares.length > 0) {$('#all_shares').find("tr:gt(0)").remove();}
  var count = 0;
  $.each(all_shares, function(key, value) {
    $.getJSON(api_url + '/web/share/' + value, function(data) {
      if (data) {
        share = data;
        tr = $('<tr/>').attr('id', share).addClass('c-table__row');
        tr.append($('<td/>').addClass("c-table__cell").append(value.substr(-8))
          .append($("<span/>").addClass("u-block u-text-mute").append($.format.prettyDate(new Date(share.share_data.timestamp * 1000))))
        );
        tr.append($('<td/>').addClass("c-table__cell").append(share.share_data.payout_address));
        $('#all_shares').append(tr);
      }
    });
  });
});

// Place the currency symbol for the currency the node is mining.  If
// it's Bitcoin, use the fontawesome BTC icon
var set_currency_symbol = true;
$(document).on('update_currency', function(e, eventInfo) {
    if (currency_info.symbol === 'BTC') {
        // use fontawesome BTC symbol
        currency = $('<i/>').attr('class', 'fa fa-btc fa-fw');
    }
    else {
        currency = $('<span/>').append(currency_info.symbol);
    }

    if (set_currency_symbol) {
        $('#currency').append('(').append(currency).append(')');
        set_currency_symbol = false;
    }
});

// Updates the 'Updated:' field in page header
$(document).on('update_time', function(e, eventInfo) {
    dts = $.format.date(new Date(), 'yyyy-MM-dd hh:mm:ss p');
    $('#updated').text(dts);
});

// ==================================================================

var fetchdata = function() {
    $.getJSON(api_url + '/rate', function(data) {
        if (data) { rate = data; }
    });

    $.getJSON(api_url + '/web/currency_info', function(data) {
        if (data) { currency_info = data; }
        $(document).trigger('update_currency');

        $.getJSON(api_url + '/local_stats', function(data) {
            if (data) { local_stats = data; }

            $.getJSON(api_url + '/current_payouts', function(data) {
                if (data) { current_payouts = data; }

                $.getJSON(api_url + '/payout_addr', function(data) {
                    if (data) { payout_addr = data; }

                    $.getJSON(api_url + '../global_stats', function(data) {
                            if (data) { global_stats= data; }

                            $(document).trigger('update_miners');
                            $(document).trigger('update_time');
                    });
                });
            });
        });
    });
};

var fetchBlocks = function() {
    $.getJSON(api_url + '/web/currency_info', function(data) {
        if (data) { currency_info = data; }

        $.getJSON(api_url + '/recent_blocks', function(data) {
            if (data) { recent_blocks = data; }
            $(document).trigger('update_blocks');
        });
    });
};

var fetchGraph = function(interval) {
    var graph_hashrate = [], graph_doa_hashrate = [], graph_blocks = [];

    // Fetch Local Hashrates
    $.getJSON(api_url + '/web/graph_data/local_hash_rate/last_' + interval, function(data) {
        $.each(data, function(key, value) {
            el = [];
            el.push(parseInt(value[0]) * 1000, parseFloat(value[1]));
            graph_hashrate.push(el);
        });

        graph_hashrate.sort();

        // Fetch Local DOA Hashrates
        $.getJSON(api_url + '/web/graph_data/local_dead_hash_rate/last_' + interval, function(data) {
            $.each(data, function(key, value) {
                el = [];
                el.push(parseInt(value[0]) * 1000, parseFloat(value[1]));
                graph_doa_hashrate.push(el);
            });

            graph_doa_hashrate.sort();

            // Fetch Recently Found Blocks
            $.getJSON(api_url + '/recent_blocks', function(data) {
                $.each(data, function(key, block) {
                    el = [];
                    el.push(parseInt(block["ts"]) * 1000);
                    graph_blocks.push(el);
                });
                //draw(graph_hashrate, graph_doa_hashrate, graph_blocks, 'js-chart-hourly-hashrate', interval);
            });
        });
    });
};

var setMyMiners = function() {
    localStorage.miners = $('#myminers').val();
    localStorage.onlyclientminers = $('#onlymyminers').prop('checked');
    $(document).trigger('update_miners');
};

var fetchMyMiners = function() {
    $('#myminers').val(localStorage.miners);
    $('#onlymyminers').prop('checked', localStorage.onlyclientminers == 'true' ? true : false);
};

var initThemes = function() {
    $('#settheme li').click(function() {
        $(this).addClass('active').siblings().removeClass('active');
        localStorage.theme = $(this).text();
        changeTheme(localStorage.theme);
    });

    $('#settheme li').each(function() {
        if (localStorage.theme) {
            if ($(this).text() === localStorage.theme) {
                $(this).addClass('active').siblings().removeClass('active');
                changeTheme(localStorage.theme);
            }
        }
        else {
            changeTheme('default');
        }
    });
};

var changeTheme = function(theme) {
    $('#theme').attr('href', 'css/bootstrap-' + theme.toLowerCase() + '.min.css');
};

var fetchShares = function() {
    $.getJSON(api_url + '/web/my_share_hashes', function(data) {
      if (data) { all_shares = data; }
      $(document).trigger('update_shares');
    });
};

// update tables and miner data
setInterval(function() {
    $(document).trigger('update');
}, config.reload_interval * 1000);

// update blocks and graph
setInterval(function() {
    $(document).trigger('update_graph');
}, config.reload_chart_interval * 1000);
