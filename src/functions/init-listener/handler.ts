import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayEvent } from 'aws-lambda';
import { ScoreboardService } from "../../services/scoreboard-service"
const initListener = async (event:APIGatewayEvent) => {
  const body = JSON.parse(event.body);
  console.log(body)
  const scoreboardService = new ScoreboardService();
  const { ts } = body.channel

  const scoreboard = scoreboardService.getScoreboard(ts);
  if (scoreboard){
    return formatJSONResponse({
      response_type: "in_channel",
      text: 'A Wordle leaderboard has already been created.'
    })
  }

  const res = scoreboardService.createScoreboard({
    today: {},
    total: [],
    ts
  })

  console.log(res)

  return formatJSONResponse({
    response_type: "in_channel",
    text: 'A Wordle leaderboard has been created for this channel.'
  })
}

export const main = middyfy(initListener);
