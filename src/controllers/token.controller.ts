import { IToken } from "@interfaces/token";
import { TokenDto } from "../dto/token.dto";
import { BadRequestException, Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation } from "@nestjs/swagger";
import { OnchainDataService } from "@services/onchain-data.service";
import { isAddress } from "viem";

@Controller({ path: "tokens", version: "1" })
@ApiTags("tokens")
export class TokenController
{
    public constructor(private readonly onchainDataService: OnchainDataService) {}

    @Get()
    @ApiOperation({ summary: 'Get all tokens' })
    @ApiResponse({ status: 200, description: 'List of all tokens', type: TokenDto, isArray: true })
    public getTokens(): TokenDto[]
    {
        return Object.values(this.onchainDataService.getAllTokens());
    }


    @Get(":address")
    @ApiOperation({ summary: 'Get specific token by address' })
    @ApiResponse({ status: 200, description: 'The token information', type: TokenDto })
    @ApiResponse({ status: 404, description: 'Token not found' })
    @ApiResponse({ status: 400, description: 'Invalid address format' })
    public getTokenFromAddress(@Param("address") address: string): TokenDto
    {
        if (!isAddress(address))
        {
            throw new BadRequestException("Invalid request");
        }

        const token: IToken | undefined = this.onchainDataService.getToken(address);
        if (token !== undefined) return token;

        throw new NotFoundException("Token does not exist");
    }
}
