---
description: 
globs: 
alwaysApply: false
---
# Baseball Savant Response Structures

This document details the structure of responses from Baseball Savant's various endpoints, focusing on both batter and pitcher metrics. Understanding these structures is crucial for proper data extraction and processing.

## Batter Data

### Basic Search Endpoint (`/statcast_search/csv`)

The basic search endpoint returns CSV data with the following key fields:

```csv
player_id,player_name,team,stand,ba,obp,slg,ops,woba,xwoba,exit_velocity_avg,launch_angle,barrel_batted_rate,k_percent,bb_percent
```

#### Field Descriptions:

- `player_id`: MLB ID for the player
- `player_name`: Full name of the player
- `team`: Current team abbreviation
- `stand`: Batting handedness (L/R/S)
- `ba`/`avg`: Batting average
- `obp`: On-base percentage
- `slg`: Slugging percentage
- `ops`: On-base plus slugging
- `woba`: Weighted on-base average
- `xwoba`: Expected weighted on-base average
- `exit_velocity_avg`: Average exit velocity (also appears as `launch_speed` or `avg_hit_speed`)
- `launch_angle`: Average launch angle (also appears as `avg_hit_angle`)
- `barrel_batted_rate`: Barrel percentage (also appears as `barrel_percent` or `brl_percent`)
- `k_percent`: Strikeout percentage
- `bb_percent`: Walk percentage

### Leaderboard Endpoint (`/leaderboard/statcast`)

The leaderboard endpoint provides additional quality of contact metrics:

```csv
player_id,player_name,team,anglesweetspotpercent,ev95percent,avg_hit_speed,xwoba,barrel_batted_rate
```

#### Field Descriptions:

- `anglesweetspotpercent`: Percentage of balls hit in the sweet spot (8-32 degrees)
- `ev95percent`: Percentage of balls hit 95+ mph (Hard Hit %)
- `avg_hit_speed`: Average exit velocity
- `xwoba`: Expected weighted on-base average
- `barrel_batted_rate`: Barrel percentage

### Expected Stats Endpoint (`/leaderboard/expected_statistics`)

This endpoint focuses on expected statistics:

```csv
player_id,player_name,team,xba,xslg,xwoba,xobp,xiso,bacon,exit_velocity_avg,launch_angle_avg,sweet_spot_percent,barrel_percent
```

#### Field Descriptions:

- `xba`: Expected batting average
- `xslg`: Expected slugging percentage
- `xwoba`: Expected weighted on-base average
- `xobp`: Expected on-base percentage
- `xiso`: Expected isolated power
- `bacon`: Batting average on contact
- `exit_velocity_avg`: Average exit velocity
- `launch_angle_avg`: Average launch angle
- `sweet_spot_percent`: Sweet spot percentage
- `barrel_percent`: Barrel percentage

## Pitcher Data

### Basic Search Endpoint (`/statcast_search/csv`)

For pitchers, the basic search endpoint returns:

```csv
player_id,player_name,team,p_throws,era,whip,k_percent,bb_percent,zone_percent,first_pitch_strike,whiff_percent,csw_percent
```

#### Field Descriptions:

- `player_id`: MLB ID for the player
- `player_name`: Full name of the player
- `team`: Current team abbreviation
- `p_throws`: Pitching hand (L/R)
- `era`: Earned run average
- `whip`: Walks and hits per inning pitched
- `k_percent`: Strikeout percentage
- `bb_percent`: Walk percentage
- `zone_percent`: Percentage of pitches in the strike zone
- `first_pitch_strike`: First pitch strike percentage
- `whiff_percent`: Whiff percentage
- `csw_percent`: Called strikes + whiffs percentage

### Pitch Arsenal Endpoint (`/leaderboard/pitch-arsenal-stats`)

This endpoint provides detailed pitch type information:

```csv
player_id,player_name,pitch_type,pitch_name,count,pitch_percent,velocity,spin_rate,whiff_percent,put_away_percent,hard_hit_percent,xwoba
```

#### Field Descriptions:

- `pitch_type`: Pitch type code (FF, SL, CH, etc.)
- `pitch_name`: Full name of the pitch
- `count`: Number of pitches thrown
- `pitch_percent`: Usage percentage
- `velocity`: Average velocity
- `spin_rate`: Average spin rate
- `whiff_percent`: Whiff percentage
- `put_away_percent`: Put away percentage
- `hard_hit_percent`: Hard hit percentage against
- `xwoba`: Expected wOBA against

### Movement Profile Endpoint

When querying for pitch movement:

```csv
player_id,player_name,pitch_type,horizontal_break,induced_vertical_break,release_extension,release_height,release_side
```

#### Field Descriptions:

- `horizontal_break`: Horizontal movement in inches
- `induced_vertical_break`: Vertical movement in inches
- `release_extension`: Release extension in feet
- `release_height`: Release height in feet
- `release_side`: Release side in feet

## Field Name Variations

Baseball Savant often provides multiple variations of the same metric. Here are common variations:

### Batting Metrics:

- Exit Velocity: `exit_velocity_avg`, `launch_speed`, `avg_hit_speed`
- Launch Angle: `launch_angle_avg`, `launch_angle`, `avg_hit_angle`
- Sweet Spot: `sweet_spot_percent`, `anglesweetspotpercent`, `sweet_spot_rate`
- Hard Hit: `hard_hit_percent`, `ev95percent`, `hard_hit_rate`
- Barrel: `barrel_percent`, `barrel_batted_rate`, `brl_percent`, `barrels_per_bbe_percent`

### Pitching Metrics:

- Zone Rate: `zone_rate`, `zone_percent`, `in_zone_percent`
- Chase Rate: `chase_rate`, `o_swing_percent`, `outside_zone_swing_percent`
- Contact: `zone_contact_percent`, `z_contact_percent`, `in_zone_contact_percent`
- Put Away: `put_away_percent`, `put_away_rate`, `k_percent`

## Response Handling Best Practices

1. Always check for multiple field name variations when extracting metrics
2. Validate numeric values and convert percentages consistently
3. Handle missing data gracefully with reasonable defaults
4. Log extracted values for debugging purposes
5. Implement retry logic for rate limits (429 responses)
6. Cache responses when appropriate using the recommended TTLs
7. Verify response format (CSV vs HTML) before parsing
