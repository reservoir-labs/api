import { PairDto } from '../dto/pair.dto';
import { IPair, IPairs } from "@interfaces/pair";
import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { OnchainDataService } from "@services/onchain-data.service";
import { isAddress } from "viem";

@Controller({ path: "pairs", version: "1" })
@ApiTags("pairs")
export class PairController {
    public constructor(private readonly onchainDataService: OnchainDataService) {}

    @Get()
    @ApiOperation({ summary: 'Get all pairs' })
    @ApiResponse({
        status: 200,
        description: 'List of all trading pairs',
        type: PairDto,
        isArray: true
    })
    public getPairs(): IPairs {
        return this.onchainDataService.getAllPairs();
    }

    @Get(":address")
    @ApiOperation({ summary: 'Get specific pair by address' })
    @ApiResponse({
        status: 200,
        description: 'The pair information',
        type: PairDto
    })
    @ApiResponse({ status: 404, description: 'Pair not found' })
    @ApiResponse({ status: 400, description: 'Invalid address format' })
    public getPairFromAddress(@Param("address") address: string): IPair {
        if (!isAddress(address)) {
            throw new BadRequestException("Invalid request");
        }

        const pair: IPair | undefined = this.onchainDataService.getPair(address);
        if (pair !== undefined) return pair;

        throw new NotFoundException("Pair does not exist");
    }
}
